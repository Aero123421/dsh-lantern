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

notes="dsh-lantern ${tag}. Verify with \`sha256sum -c SHA256SUMS\`, then \`dsh plugin --profile web add\` the tgz."

# Look the tag up in the release list. Do not treat a missing release as a
# text match on an error string: a published release and a draft are both rows.
draft=$(gh release list --limit 1000 --json tagName,isDraft --jq ".[] | select(.tagName == \"$tag\") | .isDraft")
case "$draft" in
  true)
    # Same-named draft: keep its title and notes. Upload only asset names
    # that are not attached yet. Never replace an asset that is already there.
    existing=$(gh release view "$tag" --json assets --jq '.assets[].name')
    pending=$(mktemp)
    trap 'rm -f "$pending"' EXIT
    : > "$pending"
    conflict=0
    for file in "$@"; do
      name=${file##*/}
      if printf '%s\n' "$existing" | grep -Fxq -- "$name"; then
        conflict=1
      else
        printf '%s\n' "$file" >> "$pending"
      fi
    done
    if [ -s "$pending" ]; then
      set --
      while IFS= read -r file; do
        set -- "$@" "$file"
      done < "$pending"
      gh release upload "$tag" "$@"
    fi
    if [ "$conflict" -ne 0 ]; then
      echo "既存の資産は置き換えない" >&2
      exit 1
    fi
    ;;
  false)
    echo "Release ${tag} is already published. This workflow does not publish or edit it." >&2
    exit 1
    ;;
  '')
    gh release create "$tag" "$@" --verify-tag --draft --title "$tag" --notes "$notes"
    ;;
  *)
    echo "Could not tell whether ${tag} is a draft." >&2
    exit 1
    ;;
esac
