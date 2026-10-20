#!/bin/sh
# Create a draft GitHub Release for a tag, or attach assets to the draft
# that already uses that tag. Never publishes. A person publishes the Release.
set -eu

tag=${1:?tag}
shift
if [ "$#" -eq 0 ]; then
  echo "draft-release: no assets to attach" >&2
  exit 1
fi

root=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
changelog=${DRAFT_RELEASE_CHANGELOG:-$root/CHANGELOG.md}
version=${tag#v}

# Look the tag up in the release list. Do not treat a missing release as a
# text match on an error string: a published release and a draft are both rows.
# A full page of 1000 with no matching tag is not "missing": the tag may sit
# past the page, so creating another release would be wrong.
page=$(gh release list --limit 1000 --json tagName,isDraft --jq '"\(length)\n\( (map(select(.tagName == "'"$tag"'"))[0].isDraft) as $d | if $d == null then "" else ($d|tostring) end )"')
count=$(printf '%s\n' "$page" | sed -n '1p')
draft=$(printf '%s\n' "$page" | sed -n '2p')
if [ "$count" -eq 1000 ] && [ -z "$draft" ]; then
  echo "gh release list --limit 1000 returned 1000 releases and did not include ${tag}. Refusing to create a release." >&2
  exit 1
fi

case "$draft" in
  true)
    # Same-named draft: keep its title and notes. Compare every asset name
    # first. One overlap means upload nothing; a person deletes the old asset.
    existing=$(gh release view "$tag" --json assets --jq '.assets[].name')
    conflicts=$(mktemp)
    trap 'rm -f "$conflicts"' EXIT
    : > "$conflicts"
    for file in "$@"; do
      name=${file##*/}
      if printf '%s\n' "$existing" | grep -Fxq -- "$name"; then
        printf '%s\n' "$name" >> "$conflicts"
      fi
    done
    if [ -s "$conflicts" ]; then
      echo "既存の資産は置き換えない" >&2
      while IFS= read -r name; do
        echo "gh release delete-asset ${tag} ${name}" >&2
      done < "$conflicts"
      exit 1
    fi
    gh release upload "$tag" "$@"
    ;;
  false)
    echo "Release ${tag} is already published. This workflow does not publish or edit it." >&2
    exit 1
    ;;
  '')
    if [ ! -f "$changelog" ]; then
      echo "draft-release: no changelog notes for ${version}" >&2
      exit 1
    fi
    if ! body=$(awk -v version="$version" '
      $0 == "## " version { capture = 1; next }
      capture && /^## / { exit }
      capture { lines[++n] = $0 }
      END {
        start = 1
        while (start <= n && lines[start] ~ /^[[:space:]]*$/) start++
        end = n
        while (end >= start && lines[end] ~ /^[[:space:]]*$/) end--
        if (end < start) exit 2
        for (i = start; i <= end; i++) print lines[i]
      }
    ' "$changelog"); then
      echo "draft-release: no changelog notes for ${version}" >&2
      exit 1
    fi
    notesfile=$(mktemp)
    trap 'rm -f "$notesfile"' EXIT
    printf '%s\n' "$body" > "$notesfile"
    gh release create "$tag" "$@" --verify-tag --draft --title "$tag" --notes-file "$notesfile"
    ;;
  *)
    echo "Could not tell whether ${tag} is a draft." >&2
    exit 1
    ;;
esac
